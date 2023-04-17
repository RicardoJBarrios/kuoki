import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { EnvironmentValuePipe } from './environment-value.pipe';
import { EnvironmentModule } from '../module';

const fromEnv = 0;
const initialState = { a: fromEnv, b: 'v{{a}}' };

describe('EnvironmentValuePipe', () => {
  let spectator: SpectatorPipe<EnvironmentValuePipe>;
  const createPipe = createPipeFactory({
    pipe: EnvironmentValuePipe,
    imports: [EnvironmentModule.forRoot({ initialState })]
  });

  it(`returns the path if no EnvironmentQuery`, () => {
    jest.spyOn(EnvironmentModule, 'query', 'get').mockReturnValue(undefined);
    spectator = createPipe(`{{ 'a' | envValue }}`);
    expect(spectator.element).toHaveText('a');
    jest.restoreAllMocks();
  });

  it(`transforms the path to the environment value`, () => {
    spectator = createPipe(`{{ 'a' | envValue }}`);
    expect(spectator.element).toHaveText('0');
  });

  it(`returns the path if no environment value`, () => {
    spectator = createPipe(`{{ 'z' | envValue }}`);
    expect(spectator.element).toHaveText('z');
  });

  it(`transforms the path with defaultValue`, () => {
    const options = { defaultValue: 'D' };
    spectator = createPipe(`{{ 'z' | envValue:options }}`, { hostProps: { options } });
    expect(spectator.element).toHaveText('D');
  });

  it(`transforms the path with targetType`, () => {
    const options = { targetType: (v: number) => v + 1 };
    spectator = createPipe(`{{ 'a' | envValue:options }}`, { hostProps: { options } });
    expect(spectator.element).toHaveText('1');
  });

  it(`transforms the path with transpile`, () => {
    const options = { transpile: { a: 0 } };
    spectator = createPipe(`{{ 'b' | envValue:options }}`, { hostProps: { options } });
    expect(spectator.element).toHaveText('v0');
  });

  it(`transforms the path with transpile && config`, () => {
    const options = { transpile: {}, config: { transpileEnvironment: true } };
    spectator = createPipe(`{{ 'b' | envValue:options }}`, { hostProps: { options } });
    expect(spectator.element).toHaveText('v0');
  });

  it(`transforms the path with required`, () => {
    const options = { required: true };
    spectator = createPipe(`{{ 'a' | envValue:options }}`, { hostProps: { options } });
    expect(spectator.element).toHaveText('0');
  });

  it(`throws error if the path doesn't exist and required`, () => {
    const options = { required: true };
    expect(() => createPipe(`{{ 'z' | envValue:options }}`, { hostProps: { options } })).toThrowWithMessage(
      ReferenceError,
      'The environment property "z" is not defined'
    );
  });

  it(`transforms the path with interpolation`, () => {
    spectator = createPipe(`<span title="{{ 'a' | envValue }}">Property</span>`);
    expect(spectator.element.querySelector('span')).toHaveAttribute('title', '0');
  });

  it(`transforms the path with input`, () => {
    spectator = createPipe(`<span [title]="'a' | envValue">Property</span>`);
    expect(spectator.element.querySelector('span')).toHaveAttribute('title', '0');
  });
});
