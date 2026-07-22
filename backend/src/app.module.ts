import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './resources/users/users.module';
import { User } from './resources/users/entities/user.entity';
import { Profile } from './resources/profiles/entities/profiles.entity';
import { Post } from './resources/posts/entities/post.entity';
import { PostsStats } from './resources/posts-stats/entities/post-stats.entity';
import { ProfilesModule } from './resources/profiles/profiles.module';
import { PostsModule } from './resources/posts/posts.module';
import { PostsStatsModule } from './resources/posts-stats/posts-stats.module';
import { AuthModule } from './resources/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './resources/auth/auth.guard';

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
        entities: [User, Profile, Post, PostsStats],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UsersModule,
    ProfilesModule,
    PostsModule,
    PostsStatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
