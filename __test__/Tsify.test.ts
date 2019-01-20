import { Tsify } from '../src/Tsify'
import { AEntity } from '../src/AEntity';
import { entity } from '@google-cloud/datastore/build/src/entity';

import * as DS from '@google-cloud/datastore/build/src/index';

const ds = new DS.Datastore();

class FakeEntity extends AEntity<entity.Int> {

    public p1: string;
    public p2: number;

    public constructor() {
        super(null, null, null, []);
    }
}

test("save entity sync back key", async () => {
    var e = new FakeEntity();
    e.p1 = 'string propert';
    e.p2 = 3;

    var k = await Tsify.save(e);

    expect(e.id).toBeTruthy();
    expect(k.id).toBeTruthy();
});