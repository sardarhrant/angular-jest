import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: AppComponent;

  beforeEach(() => {
    fixture = new AppComponent();
  });

  it.skip('should have a title AngularJestSetUp', () => {
    expect(fixture.title).toEqual('AngularJestSetUp');
  });

  describe('Exceptions', () => {
    // Exceptions
    it.only('should throw an error', () => {
      expect(() => fixture.compileAndroidCode()).toThrow();
    });

    it.only('should throw an error', () => {
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
});
