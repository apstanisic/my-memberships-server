import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  GetPagination,
  GetUser,
  IdArrayDto,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  UUID,
  ValidUUID,
} from 'nestjs-extra';
import { User } from '../users/user.entity';
import { Location } from './location.entity';
import { CreateLocationDto, UpdateLocationDto } from './location.dto';
import { LocationsService } from './locations.service';

// import { IdArrayDto } from '../core/id-array.dto';

/**
 * Controller for managing locations
 * Crud Controller
 */
@Controller('companies/:companyId/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /** Get paginated and filtered locations */
  @Get('')
  find(
    @Param('companyId', ValidUUID) companyId: string,
    @GetPagination() params: PaginationParams,
  ): PgResult<Location> {
    return this.locationsService.paginate(params, { companyId });
  }

  @Get('ids')
  async getLocationsByIds(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Query() query: IdArrayDto,
  ): Promise<Location[]> {
    // return [];
    return this.locationsService.findByIds(query.ids, { where: { companyId } });
  }

  /** Get location by id */
  @Get(':id')
  findById(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('id', ValidUUID) id: string,
  ): Promise<Location> {
    return this.locationsService.findOne({ id, companyId });
  }

  /** Add new location */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post('')
  async create(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Body() location: CreateLocationDto,
    @GetUser() user: User,
  ): Promise<Location> {
    return this.locationsService.createLocation({ companyId, location, user });
  }

  /**
   * Update location
   */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  async update(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('id', ValidUUID) id: UUID,
    @Body() updateData: UpdateLocationDto,
    @GetUser() user: User,
  ): Promise<Location> {
    return this.locationsService.updateWhere({ id, companyId }, updateData, {
      user,
      domain: companyId,
    });
  }

  /**
   * Delete location
   */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  async delete(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('id', ValidUUID) id: string,
    @GetUser() user: User,
  ): Promise<Location> {
    return this.locationsService.deleteLocation({ id, companyId, user });
    // return this.locationsService.deleteWhere(
    //   { id, companyId },
    //   { user, domain: companyId },
    // );
  }
}
