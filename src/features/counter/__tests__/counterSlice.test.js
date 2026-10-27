import counterReducer, {
  increment,
  decrement,
  reset,
  incrementByAmount,
} from '../counterSlice';

describe('counterSlice', () => {
  const initialState = { value: 0 };

  it('should return the initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual(
      initialState,
    );
  });

  it('should increment the counter', () => {
    expect(counterReducer(initialState, increment())).toEqual({ value: 1 });
  });

  it('should decrement the counter', () => {
    expect(counterReducer({ value: 1 }, decrement())).toEqual({ value: 0 });
  });

  it('should not allow the counter to go below zero', () => {
    expect(counterReducer(initialState, decrement())).toEqual({ value: 0 });
  });

  it('should add the provided amount', () => {
    expect(counterReducer(initialState, incrementByAmount(5))).toEqual({
      value: 5,
    });
  });

  it('should reset the counter', () => {
    expect(counterReducer({ value: 10 }, reset())).toEqual(initialState);
  });
});
