import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfilesDto } from './dto/create-profiles.dto';
import { UpdateProfilesDto } from './dto/update-profiles.dto';
import { Profile } from './entities/profiles.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersDataService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async create(createProfilesDto: CreateProfilesDto): Promise<Profile> {
    const profiles = this.profilesRepository.create(createProfilesDto);
    return await this.profilesRepository.save(profiles);
  }

  async findAll(): Promise<Profile[]> {
    return await this.profilesRepository.find();
  }

  async findOne(id: number): Promise<Profile> {
    const profiles = await this.profilesRepository.findOne({ where: { id } });
    if (!profiles) {
      throw new NotFoundException(`Profiles with ID ${id} not found`);
    }
    return profiles;
  }

  async update(
    id: number,
    updateProfilesDto: UpdateProfilesDto,
  ): Promise<Profile> {
    const profiles = await this.findOne(id);
    const updatedProfiles = this.profilesRepository.merge(
      profiles,
      updateProfilesDto,
    );
    return await this.profilesRepository.save(updatedProfiles);
  }

  async remove(id: number): Promise<Profile> {
    const profiles = await this.findOne(id);
    return await this.profilesRepository.remove(profiles);
  }
}
