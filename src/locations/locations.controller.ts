import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IfAllowed } from '../core/access-control/if-allowed.decorator';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { PaginationParams } from '../core/pagination/pagination-options';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { PgResult } from '../core/pagination/pagination.types';
import { ValidUUID } from '../core/uuid.pipe';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';
import { Location } from './location.entity';
import { CreateLocationDto, UpdateLocationDto } from './locations.dto';
import { LocationsService } from './locations.service';
import { IdArrayDto } from '../core/id-array.dto';

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
  async getUsersByIds(@Query() query: IdArrayDto): Promise<Location[]> {
    return this.locationsService.findByIds(query.ids);
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
    @GetUser() user: User,
  ): Promise<Location> {
    return this.locationsService.createLocation({ companyId, location, user });
  }

  /** Update location */
  @IfAllowed()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  async update(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('id', ValidUUID) id: string,
    @Body() updateData: UpdateLocationDto,
    @GetUser() user: User,
  ): Promise<Location> {
    return this.locationsService.updateWhere({ id, companyId }, updateData, {
      user,
      domain: companyId,
    });
  }

  /** Delete location */
  @IfAllowed()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  async delete(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('id', ValidUUID) id: string,
    @GetUser() user: User,
  ): Promise<Location> {
    return this.locationsService.deleteWhere(
      { id, companyId },
      { user, domain: companyId },
    );
  }
}
