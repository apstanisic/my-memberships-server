import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginationParams } from '../core/pagination/pagination-options';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { ValidUUID } from '../core/uuid.pipe';
import { LocationsService } from './locations.service';
import { IfAllowed } from '../access-control/if-allowed.decorator';
import { PermissionsGuard } from '../access-control/permissions.guard';
import { CreateLocationDto, UpdateLocationDto } from './locations.dto';
import { Location } from './location.entity';
import { PgResult } from '../core/pagination/pagination.types';

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

  /** Get location by id */
  @Get(':id')
  findById(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('id', ValidUUID) id: string,
  ): Promise<Location> {
    return this.locationsService.findOne({ id, companyId });
  }

  /** Add new location */
  @IfAllowed()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post()
  async create(
    @Param('companyId', ValidUUID) companyId: string,
    @Body() location: CreateLocationDto,
  ): Promise<Location> {
    return this.locationsService.create({ ...location, companyId });
  }

  /** Update location */
  @IfAllowed()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  async update(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('id', ValidUUID) id: string,
    @Body() updateData: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationsService.updateWhere({ id, companyId }, updateData);
  }

  /** Delete location */
  @IfAllowed()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  async delete(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('id', ValidUUID) id: string,
  ): Promise<Location> {
    return this.locationsService.deleteWhere({ id, companyId });
  }
}
