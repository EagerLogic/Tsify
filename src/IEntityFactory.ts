import { AEntity } from './AEntity';
import { TId } from './Key';


export interface IEntityFactory<$Entity extends AEntity<TId>> {

    createEntity(): $Entity;

}