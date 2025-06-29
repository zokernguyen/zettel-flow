import { expect, test } from 'vitest'

import { ZettelID } from "../src/zettelID";

test('ZettelID generating Children', () => {
  const ids = [
    {
      test: `1`,
      result: `1a`
    },
    {
      test: `12`,
      result: `12a`
    },
    {
      test: `12a`,
      result: `12a1`
    },
    {
      test: `12aaa`,
      result: `12aaa1`
    },
    {
      test: `12aaa29`,
      result: `12aaa29a`
    },
    {
      test: `10wx233ax`,
      result: `10wx233ax1`
    },
    {
      test: `10wx233`,
      result: `10wx233a`
    },
  ];

  let zettelId = undefined;

  for (let i = 0; i < ids.length; i++) {
    if (ids[i]){
      zettelId = new ZettelID(ids[i].test);
      expect(zettelId.genNextChildId()).toBe(ids[i].result);    
    } 
  }
})

test('ZettelID generating Siblings', () => {
  const ids = [
    {
      test: `1`,
      result: `2`
    },
    {
      test: `1a`,
      result: `1b`
    },
    {
      test: `1x`,
      result: `1y`
    },
    {
      test: `20`,
      result: `21`
    },
    {
      test: `29`,
      result: `30`
    },
    {
      test: `99`,
      result: `100`
    },
    {
      test: `20aa`,
      result: `20ab`
    },
    {
      test: `20az`,
      result: `20aza`
    },
    {
      test: `20zz`,
      result: `20zza`
    },
    {
      test: `20zy`,
      result: `20zz`
    },
    {
      test: `232xaa92`,
      result: `232xaa93`
    },
    {
      test: `20at`,
      result: `20au`
    },
  ];

  let zettelId = undefined;

  for (let i = 0; i < ids.length; i++) {
    if (ids[i]){
      zettelId = new ZettelID(ids[i].test);
      expect(zettelId.genNextSiblingId()).toBe(ids[i].result);    
    } 
  }
})