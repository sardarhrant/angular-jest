import {
  catchError,
  concatMap,
  delay,
  map,
  mergeMap,
  switchMap,
  take,
} from 'rxjs/operators';
import { AppComponent } from './app.component';
import { cold } from 'jest-marbles';
import { TestScheduler } from 'rxjs/testing';
import { concat, from, interval, of, throwError } from 'rxjs';
import { breweryTypeahead } from './app.component';

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

describe('Marble testing in RxJS', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should convert ASCII diagrams into observables', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const source$ = cold('--a-b---c');
      const expected = '--a-b---c';

      expectObservable(source$).toBe(expected);
    });
  });

  it('should allow configuration of emitted values', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const source$ = cold('--a-b---c', { a: 1, b: 2, c: 3 });
      const final$ = source$.pipe(map((val: number) => val * 10));
      const expected = '--a-b---c';

      expectObservable(final$).toBe(expected, { a: 10, b: 20, c: 30 });
    });
  });

  it('should let you identify subscription points', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable, expectSubscriptions } = helpers;
      const source$ = cold('-a---b-|');
      const sourceTwo$ = cold('-c---d-|');
      const final$ = concat(source$, sourceTwo$);

      const expected = '-a---b--c---d-|';

      const sourceOneExpectedSub = '^-- -- --!';
      const sourceTwoExpectedSub = '-- -- -- -^-- -- --!';

      expectObservable(final$).toBe(expected);

      expectSubscriptions(source$.subscriptions).toBe(sourceOneExpectedSub);
      expectSubscriptions(sourceTwo$.subscriptions).toBe(sourceTwoExpectedSub);
    });
  });

  it('should let you test hot observables', () => {
    testScheduler.run((helpers) => {
      const { cold, hot, expectObservable } = helpers;
      const source$ = hot('-a-b-^-c');
      const final$ = source$.pipe(take(1));
      const expected = '--(c|)';

      expectObservable(final$).toBe(expected);
    });
  });

  it('should let you test synchronous operations', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const source$ = from([1, 2, 3, 4, 5]);
      const expected = '(abcde|)';

      expectObservable(source$).toBe(expected, {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
      });
    });
  });

  it('should let you test asynchronous operations', () => {
    testScheduler.run((helpers) => {
      const { expectObservable, hot } = helpers;
      const source$ = from([1, 2, 3, 4, 5]);
      const final$ = source$.pipe(delay(10));
      const expected = '-- -- -- -- --(abcde|)';
      // OR we can use time value const
      // expected = '10ms (abcde|)';

      expectObservable(final$).toBe(expected, {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
      });
    });
  });

  it('should debounce input by 200ms', () => {
    testScheduler.run((helpers) => {
      const term = 'testing';
      const { cold, expectObservable } = helpers;
      const source$ = cold('a', { a: { target: { value: term } } });
      const final$ = source$.pipe(
        breweryTypeahead({
          getJSON: () => of(term).pipe(delay(300)),
        })
      );
      //In breweryTypeahead debounceTime(200) + delay(300) equal to 500ms
      const expected = '500ms a';
      expectObservable(final$).toBe(expected, { a: term });
    });
  });

  it('should cancel active request if another value is emitted', () => {
    testScheduler.run((helpers) => {
      const term = 'testing';
      const { cold, expectObservable } = helpers;
      const source$ = cold('a 250ms b', {
        a: { target: { value: term } },
        b: { target: { value: term + '-b' } },
      });
      const final$ = source$.pipe(
        breweryTypeahead({
          getJSON: () => of(term).pipe(delay(300)),
        })
      );
      //In breweryTypeahead 1ms for frame a debounceTime(200) + delay(300) equal to 500ms (1+200+300+250 = 751)
      const expected = '751ms a';
      expectObservable(final$).toBe(expected, { a: term });
    });
  });

  it('should not emit duplicate value in a row', () => {
    testScheduler.run((helpers) => {
      const term = 'testing';
      const { cold, expectObservable } = helpers;
      const source$ = cold('a', {
        a: { target: { value: 'first' } },
        b: { target: { value: 'first' } },
      });
      const final$ = source$.pipe(
        breweryTypeahead({
          getJSON: () => of(term).pipe(delay(300)),
        })
      );
      //In breweryTypeahead debounceTime(200) + delay(300) equal to 500ms
      const expected = '500ms a';
      expectObservable(final$).toBe(expected, { a: term });
    });
  });

  it('should ignore ajax errors', () => {
    testScheduler.run((helpers) => {
      const term = 'testing';
      const { cold, expectObservable } = helpers;
      const source$ = cold('a', {
        a: { target: { value: 'first' } },
        b: { target: { value: 'first' } },
      });
      const final$ = source$.pipe(
        breweryTypeahead({
          getJSON: () => throwError('error'),
        })
      );

      const expected = '';
      expectObservable(final$).toBe(expected);
    });
  });

  it('throw error', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    testScheduler.run(({ expectObservable }) => {
      const obj = {
        firstName: 'Hrant',
        lastName: 'Sardaryan',
      };

      const source$ = interval(100).pipe(
        mergeMap((value) => {
          if (value > 0) {
            return throwError('error');
          }
          return of(value);
        })
      );
      const expected = '100ms 0 99ms #';
      expectObservable(source$).toBe(expected, [0]);
    });
  });
});
