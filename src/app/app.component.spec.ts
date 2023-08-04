import { concatMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { AppComponent } from './app.component';
import { cold } from 'jest-marbles';

describe('AppComponent', () => {
  let fixture: AppComponent;

  beforeEach(() => {
    fixture = new AppComponent();
  });

  it('should have a title AngularJestSetUp', () => {
    expect(fixture.title).toEqual('AngularJestSetUp');
  });

  describe('Exceptions', () => {
    // Exceptions
    it('should throw an error', () => {
      expect(() => fixture.compileAndroidCode()).toThrow();
    });

    it('should throw an error', () => {
      expect(() => fixture.compileAndroidCode()).toThrow(Error);
    });

    it('should throw an error', () => {
      expect(() => fixture.compileAndroidCode()).toThrow(
        'you are using old Angular'
      );
    });

    it('should throw an error', () => {
      expect(() => fixture.compileAndroidCode()).toThrow(/Angular/);
    });
  });

  describe('Map', () => {
    it('shoul add "1" to each value emitted', () => {
      const values = { a: 1, b: 2, c: 3, x: 2, y: 3, z: 4 };
      const source = cold('-a-b-c-|', values);
      const expected = cold('-x-y-z-|', values);

      const result = source.pipe(map((x: number) => x + 1));
      expect(result).toBeObservable(expected);
    });
  });

  describe('SwitchMap', () => {
    it('should maps each value to inner observable and flattens', () => {
      const values = { a: 10, b: 30, x: 20, y: 40 };
      const obs1 = cold('-a-----a--b-|', values);
      const obs2 = cold('a-a-a|', values);
      const expected = cold('-x-x-x-x-xy-y-y|', values);

      const result = obs1.pipe(switchMap((x) => obs2.pipe(map((y) => x + y))));

      expect(result).toBeObservable(expected);
    });

    describe('MergeMap', () => {
      it('should maps to inner observable and return flattens', () => {
        const values = { a: 'hello', b: 'world', x: 'hello world' };
        const obs1 = cold('-a-------a--|', values);
        const obs2 = cold('-b-b-b-|', values);
        const expected = cold('--x-x-x---x-x-x-|', values);
        const result = obs1.pipe(
          mergeMap((x) => obs2.pipe(map((y) => x + ' ' + y)))
        );

        expect(result).toBeObservable(expected);
      });
    });

    describe('ConcatMap', () => {
      it('should maps to inner observable and emits in order', () => {
        const values = { a: 10, b: 30, x: 20, y: 40 };
        const a = cold('-a--------b------ab|', values);
        const b = cold('a-a-a|', values);
        const expected = cold('-x-x-x----y-y-y--x-x-xy-y-y|', values);

        const result = a.pipe(concatMap((x) => b.pipe(map((y) => x + y))));
        expect(result).toBeObservable(expected);
      });
    });
  });
});
