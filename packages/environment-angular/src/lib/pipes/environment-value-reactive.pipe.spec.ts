import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { EnvironmentValueReactivePipe } from './environment-value-reactive.pipe';
import { EnvironmentModule } from '../module';

const fromEnv = 0;
const initialState = { a: fromEnv, b: 'v{{a}}' };

describe('EnvironmentValueReactivePipe', () => {
  let spectator: SpectatorPipe<EnvironmentValueReactivePipe>;
  const createPipe = createPipeFactory({
    pipe: EnvironmentValueReactivePipe,
    imports: [EnvironmentModule.forRoot({ initialState })]
  });

  it(`returns the path if no EnvironmentQuery`, () => {
    jest.spyOn(EnvironmentModule, 'query', 'get').mockReturnValue(undefined);
    spectator = createPipe(`{{ 'a' | environmentValue$ | async }}`);
    expect(spectator.element).toHaveText('a');
    jest.restoreAllMocks();
  });

  it(`transforms the path to the environment value`, () => {
    spectator = createPipe(`{{ 'a' | environmentValue$ | async }}`);
    expect(spectator.element).toHaveText('0');
  });

  it(`returns the path if no environment value`, () => {
    spectator = createPipe(`{{ 'z' | environmentValue$ | async }}`);
    expect(spectator.element).toHaveText('z');
  });

  it(`transforms the path with defaultValue`, () => {
    const options = { defaultValue: 'D' };
    spectator = createPipe(`{{ 'z' | environmentValue$:options | async }}`, { hostProps: { options } });
    expect(spectator.element).toHaveText('D');
  });

  it(`transforms the path with targetType`, () => {
    const options = { targetType: (v: number) => v + 1 };
    spectator = createPipe(`{{ 'a' | environmentValue$:options | async }}`, { hostProps: { options } });
    expect(spectator.element).toHaveText('1');
  });

  it(`transforms the path with transpile`, () => {
    const options = { transpile: { a: 0 } };
    spectator = createPipe(`{{ 'b' | environmentValue$:options | async }}`, { hostProps: { options } });
    expect(spectator.element).toHaveText('v0');
  });

  it(`transforms the path with transpile && config`, () => {
    const options = { transpile: {}, config: { transpileEnvironment: true } };
    spectator = createPipe(`{{ 'b' | environmentValue$:options | async }}`, { hostProps: { options } });
    expect(spectator.element).toHaveText('v0');
  });

  it(`transforms the path with interpolation`, () => {
    spectator = createPipe(`<span title="{{ 'a' | environmentValue$ | async }}">Property</span>`);
    expect(spectator.element.querySelector('span')).toHaveAttribute('title', '0');
  });

  it(`transforms the path with input`, () => {
    spectator = createPipe(`<span [title]="'a' | environmentValue$ | async">Property</span>`);
    expect(spectator.element.querySelector('span')).toHaveAttribute('title', '0');
  });
});
