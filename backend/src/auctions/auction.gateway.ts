import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuctionsService } from './auctions.service';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/auctions',
})
export class AuctionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, { userId: string; teamId?: string }>();

  constructor(
    private auctionsService: AuctionsService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const user = await this.authService.validateUser(payload.sub);

      this.connectedUsers.set(client.id, { userId: user.id });

      client.emit('connected', { message: 'Connected to auction server' });
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join-auction')
  async handleJoinAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { auctionId: string; teamId?: string },
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      return { error: 'Not authenticated' };
    }

    client.join(`auction-${data.auctionId}`);

    if (data.teamId) {
      this.connectedUsers.set(client.id, { ...user, teamId: data.teamId });
    }

    const auction = await this.auctionsService.findOne(data.auctionId);
    this.server.to(`auction-${data.auctionId}`).emit('auction-updated', auction);

    return { success: true, auction };
  }

  @SubscribeMessage('leave-auction')
  async handleLeaveAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { auctionId: string },
  ) {
    client.leave(`auction-${data.auctionId}`);
    return { success: true };
  }

  @SubscribeMessage('place-bid')
  async handlePlaceBid(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { auctionId: string; amount: number },
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user || !user.teamId) {
      return { error: 'Not authenticated or no team selected' };
    }

    try {
      const bid = await this.auctionsService.placeBid(
        data.auctionId,
        user.teamId,
        user.userId,
        data.amount,
      );

      const auction = await this.auctionsService.findOne(data.auctionId);

      this.server.to(`auction-${data.auctionId}`).emit('bid-placed', {
        bid,
        auction,
      });

      return { success: true, bid };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('start-auction')
  async handleStartAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { auctionId: string },
  ) {
    try {
      const auction = await this.auctionsService.startAuction(data.auctionId);

      this.server.to(`auction-${data.auctionId}`).emit('auction-started', auction);

      return { success: true, auction };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('end-auction')
  async handleEndAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { auctionId: string },
  ) {
    try {
      const auction = await this.auctionsService.endAuction(data.auctionId);

      this.server.to(`auction-${data.auctionId}`).emit('auction-ended', auction);

      return { success: true, auction };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('update-timer')
  async handleUpdateTimer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { auctionId: string; seconds: number },
  ) {
    try {
      const auction = await this.auctionsService.updateTimer(data.auctionId, data.seconds);

      this.server.to(`auction-${data.auctionId}`).emit('timer-updated', {
        auctionId: data.auctionId,
        seconds: data.seconds,
      });

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Broadcast auction updates to all connected clients
  async broadcastAuctionUpdate(auctionId: string, auction: any) {
    this.server.to(`auction-${auctionId}`).emit('auction-updated', auction);
  }
}

