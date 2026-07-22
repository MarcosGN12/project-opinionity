import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ProfilesModule } from './profiles/profiles.module';
import { PostsModule } from './posts/posts.module';
import { PostsStatsModule } from './posts-stats/posts-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5440,
        username: 'postgres',
        password: 'postgres',
        database: 'opinionity-dev',
        entities: [User],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    ProfilesModule,
    PostsModule,
    PostsStatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
