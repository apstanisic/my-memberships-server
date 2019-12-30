import { UUID, Image } from 'nestjs-extra';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Location } from '../locations/location.entity';

/**
 * @todo Delete image on entity deletion
 * Not possible with BeforeDelete because it's
 * deleting by cascade. Must be done with triggers.
 */
@Entity('location_images')
export class LocationImage extends Image {
  @ManyToOne(
    type => Location,
    location => location.images,
    { onDelete: 'CASCADE' },
  )
  location: Location;

  @Column()
  locationId: UUID;
}
