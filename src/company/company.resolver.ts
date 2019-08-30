import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Int } from 'type-graphql';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { User } from '../user/user.entity';

/* Resolves top level company */
@Resolver((of: any) => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  /* Returns paginated companies */
  @Query((returns) => [Company], { name: 'companies' })
  async getCompanies(
    @Args({ name: 'filter', nullable: true, type: () => String })
      filter?: string,
      @Args({ name: 'page', nullable: true, type: () => Int }) page: number = 1,
  ): Promise<Company[]> {
    return this.companyService.find(filter);
    // return this.companyService.paginate(filter, page)
  }

  /* Returns company by id */
  @Query((returns) => Company, { name: 'company' })
  async getCompanyById(
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Company> {
    return this.companyService.findById(id);
  }
}

/* Resolves companies when parent is user */
@Resolver((of: any) => User)
export class UserCompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @ResolveProperty('ownedCompanies', (type) => [Company])
  getUserCompanies(@Parent() user: User) {
    return this.companyService.find({ ownerId: user.id });
  }
}
