import { Tsify } from '../src/Tsify';
import {IEntity, LongId} from '../src/IEntity';
import { entity } from '@google-cloud/datastore/build/src/entity';

import * as DS from '@google-cloud/datastore/build/src/index';
import { IEntityFactory } from '../src/IEntityFactory';
import { Key } from '../src/Key';

const ds = new DS.Datastore();

class FakeEntity implements IEntity<LongId> {

    id: LongId;

    public p1: string;
    public p2: number;
}

class FakeEntityFactory implements IEntityFactory<FakeEntity> {

    createEntity(): FakeEntity {
        return new FakeEntity();
    }

}

Tsify.registerEntity(FakeEntity, new FakeEntityFactory());

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

test("clear db", async () => {
    clearDb();
    
    var entities: FakeEntity[] = [];
    for (var i = 0; i < 10; i++) {
        entities.push(new FakeEntity());
    }

    await Tsify.saveEntities(entities);
    await clearDb();

    var res = await Tsify.find(null, null).run();
    expect(res.length).toBe(0);
})

test("save entity sync back key", async () => {
    clearDb();
    var e = new FakeEntity();
    e.p1 = 'string propert';
    e.p2 = 3;

    var k = await Tsify.save(e);

    expect(e.id).toBeTruthy();
    expect(k.id).toBeTruthy();
});

test("find by auto id", async () => {
    clearDb();
    var e = new FakeEntity();
    await Tsify.save(e);

    e = await Tsify.findByKey(Key.fromEntity(e));
    expect(e).toBeTruthy();
});

test("find by id", async () => {
    clearDb();
    var e = new FakeEntity();
    e.id = new LongId('123');
    await Tsify.save(e);

    e = await Tsify.findByKey(Key.fromEntity(e));
    expect(e).toBeTruthy();
});

async function clearDb(): Promise<void> {
    var keys = await Tsify.find(null, null).runKeysOnly();
    return Tsify.deleteByKeys(keys);
}

