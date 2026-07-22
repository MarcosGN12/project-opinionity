import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersDataService } from './profiles.service';
import { CreateProfilesDto } from './dto/create-profiles.dto';
import { UpdateProfilesDto } from './dto/update-profiles.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly usersDataService: UsersDataService) {}

  @Post()
  create(@Body() createUsersDataDto: CreateProfilesDto) {
    return this.usersDataService.create(createUsersDataDto);
  }

  @Get()
  findAll() {
    return this.usersDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersDataService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsersDataDto: UpdateProfilesDto,
  ) {
    return this.usersDataService.update(+id, updateUsersDataDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersDataService.remove(+id);
  }
}
