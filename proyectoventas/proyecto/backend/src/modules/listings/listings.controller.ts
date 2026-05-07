import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '../../common/enums';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateListingDto, SearchListingsDto, UpdateStatusDto, UpdateListingDto } from './dto';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listings: ListingsService) {}

  @Get()
  search(@Query() query: SearchListingsDto) {
    return this.listings.search(query);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  adminAll(@CurrentUser() user: { roles?: string[] }) {
    if (!user.roles?.includes(Role.Admin)) throw new ForbiddenException('Solo admin');
    return this.listings.findAllForAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: { id: string }, @Body() dto: CreateListingDto) {
    try {
      console.log('ListingsController.create called by user:', user?.id);
      console.log('CreateListingDto payload:', JSON.stringify(dto));
      return await this.listings.create(user.id, dto);
    } catch (err) {
      console.error('ListingsController.create error:', err);
      throw err;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
  ) {
    try {
      console.log('ListingsController.update called by user:', user?.id, 'id:', id);
      return await this.listings.update(user.id, id, dto);
    } catch (err) {
      console.error('ListingsController.update error:', err);
      throw err;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@CurrentUser() user: { id: string; roles?: string[] }, @Param('id') id: string) {
    try {
      console.log('ListingsController.remove called by user:', user?.id, 'id:', id);
      return await this.listings.remove(user, id);
    } catch (err) {
      console.error('ListingsController.remove error:', err);
      throw err;
    }
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@CurrentUser() user: { roles?: string[] }, @Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.listings.updateStatus(user, id, dto.status);
  }
}
