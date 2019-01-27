import { IEntity, TId } from './IEntity';


export interface IEntityFactory<$Entity extends IEntity<TId>> {

    createEntity(): $Entity;

}