import { ViewState, ReportState } from './views';

describe('ViewState', () => {
  it('should create loading state', () => {
    const state = ViewState.loading();

    expect(state.is('loading')).toBe(true);
    expect(state.is('success')).toBe(false);
  });

  it('should create success state', () => {
    const state = ViewState.success('data');

    expect(state.is('success')).toBe(true);
    expect(state.when({ success: (v) => v })).toBe('data');
  });

  it('should create empty state', () => {
    const state = ViewState.empty();

    expect(state.is('empty')).toBe(true);
  });

  it('should create failure state', () => {
    const state = ViewState.failure('error');

    expect(state.is('failure')).toBe(true);
    expect(state.when({ failure: (v) => v })).toBe('error');
  });

  it('should handle when with full resolver', () => {
    const state = ViewState.success(42);

    const result = state.when({
      loading: () => 'loading',
      success: (v) => `success-${v}`,
      empty: () => 'empty',
      failure: () => 'failure'
    });

    expect(result).toBe('success-42');
  });
});

describe('ReportState', () => {
  it('should create welcome state', () => {
    const state = ReportState.welcome('intro');

    expect(state.is('welcome')).toBe(true);
  });

  it('should create loading state', () => {
    const state = ReportState.loading();

    expect(state.is('loading')).toBe(true);
  });

  it('should create success state', () => {
    const state = ReportState.success('data');

    expect(state.is('success')).toBe(true);
  });

  it('should create empty state', () => {
    const state = ReportState.empty();

    expect(state.is('empty')).toBe(true);
  });

  it('should create failure state', () => {
    const state = ReportState.failure('error');

    expect(state.is('failure')).toBe(true);
  });

  it('should handle when with full resolver', () => {
    const state = ReportState.success('ok');

    const result = state.when({
      welcome: () => 'welcome',
      loading: () => 'loading',
      success: (v) => `success-${v}`,
      empty: () => 'empty',
      failure: () => 'failure'
    });

    expect(result).toBe('success-ok');
  });
});
