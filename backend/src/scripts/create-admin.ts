import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { dataSourceOptions } from '../data-source';

async function createAdmin() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const email = process.argv[2] || 'admin@cricauc.com';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Admin User';

  const existingUser = await userRepository.findOne({ where: { email } });

  if (existingUser) {
    console.log(`User with email ${email} already exists.`);
    await dataSource.destroy();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = userRepository.create({
    email,
    password: hashedPassword,
    name,
    role: UserRole.ADMIN,
    emailVerified: true,
  });

  await userRepository.save(admin);

  console.log(`Admin user created successfully!`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`\nPlease change the password after first login.`);

  await dataSource.destroy();
}

createAdmin().catch((error) => {
  console.error('Error creating admin user:', error);
  process.exit(1);
});
