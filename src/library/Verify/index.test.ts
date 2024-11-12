import {describe, expect, test} from 'vitest';
import {Verify} from "./index";

describe('验证测试', () => {
  const v = new Verify();

  class testClass {
    c: number = 5;

    @v.fun()
    static testStaticFun(@v.param('required') a: number) {
    }

    @v.fun()
    testAdd(@v.param('required', 'number') a: number, @v.param('required', 'number') b: number) {
      return a + b + this.c;
    }

    @v.fun()
    testChoose(@v.param('required') a = 1) {
    }

    @v.fun()
    testString(@v.param('string') a: string) {
    }

    @v.fun()
    testFun(@v.param('function') callback: Function) {
    }

    @v.fun()
    testArray(@v.param('array') array: Array<any>) {
    }

    @v.fun()
    testDate(@v.param('date') date: Date) {
    }

    @v.fun()
    testDom(@v.param('dom') dom: HTMLElement) {
      return dom;
    }

    @v.fun()
    testMap(@v.param('map') map: Map<any, any>) {
    }

    @v.fun()
    testRegExp(@v.param('regExp') object: RegExp) {
    }

    @v.fun()
    testSymbol(@v.param('symbol') object: Symbol) {
    }

    @v.fun()
    testAsyncFun(@v.param('asyncFunction') callback: Function) {
    }

    @v.fun()
    testInstanceFun(@v.param(['instanceof', testClass]) callback: Function) {
    }

    @v.fun()
    testCustomFun(@v.param(['custom', (a: any) => a > 0, '必须是正数']) a: number
      , @v.param('number', ['custom', (a: any) => a > 10, '必须大于10']) b: number) {
    }

    @v.fun()
    testBoolean(@v.param('boolean') a: boolean) {
    }
  }

  // 这里使用any避免类型错误
  const t: any = new testClass();

  test('静态方法验证', () => {
    expect(() => {
      (testClass as any).testStaticFun()
    }).toThrow();
  })
  test('传参及this指向验证', () => {
    expect(t.testAdd(1, 2)).toBe(8);
  })
  test('必要性验证', () => {
    expect(() => {
      t.testAdd()
    }).toThrow();
    expect(() => {
      t.testAdd(1)
    }).toThrow();
    expect(() => {
      t.testAdd(undefined, 1)
    }).toThrow();
  })
  test('默认参数验证', () => {
    expect(() => {
      t.testChoose()
    }).toThrow();
  })
  test('数字类型验证', () => {
    expect(() => {
      t.testAdd('1', '2')
    }).toThrow();
  })
  test('字符串验证', () => {
    expect(() => {
      t.testString(1)
    }).toThrow();
  })
  test('函数验证', () => {
    expect(() => {
      t.testFun({})
    }).toThrow();
    expect(() => {
      t.testFun(async () => {
      })
    }).not.toThrow();
  })
  test('数组验证', () => {
    expect(() => {
      t.testArray(new Map())
    }).toThrow();
  })
  test('日期验证', () => {
    expect(() => {
      t.testDate(new Date('wrong date'))
    }).toThrow();
    expect(() => {
      t.testDate(null)
    }).toThrow();
  })
  test('dom验证', () => {
    expect(() => {
      t.testDom({})
    }).toThrow();
  })
  test('map验证', () => {
    expect(() => {
      t.testMap(new WeakMap())
    }).toThrow();
    expect(() => {
      t.testMap(new Map())
    }).not.toThrow();
  })
  test('正则表达式验证', () => {
    expect(() => {
      t.testRegExp({})
    }).toThrow();
    expect(() => {
      t.testRegExp(/abc/)
    }).not.toThrow();
    expect(() => {
      t.testRegExp(new RegExp('abc'))
    }).not.toThrow();
  })
  test('symbol验证', () => {
    expect(() => {
      t.testSymbol({})
    }).toThrow();
    expect(() => {
      t.testSymbol(Symbol('test'))
    }).not.toThrow();
  })
  test('异步函数验证', () => {
    expect(() => {
      t.testAsyncFun(() => {
      })
    }).toThrow();
    expect(() => {
      t.testAsyncFun(async () => {
      })
    }).not.toThrow();
  })
  test('子类验证', () => {
    expect(() => {
      t.testInstanceFun(() => {
      })
    }).toThrow();
    expect(() => {
      t.testInstanceFun(t)
    }).not.toThrow();
  })
  test('布尔类型校验', () => {
    expect(() => {
      t.testBoolean(1)
    }).toThrow();
    expect(() => {
      t.testBoolean(true)
    }).not.toThrow();
  })
  test('自定义验证', () => {
    expect(() => {
      t.testCustomFun(0)
    }).toThrow();
    expect(() => {
      t.testCustomFun(1)
    }).not.toThrow();
    expect(() => {
      t.testCustomFun(1, 1)
    }).toThrow();
    expect(() => {
      t.testCustomFun(1, '11')
    }).toThrow();
    expect(() => {
      t.testCustomFun(1, 11)
    }).not.toThrow();
  })
})
