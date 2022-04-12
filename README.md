# 🐳 cargv 🚛
> The **easy** way to make command line arguments.

# Usage 🧪
### Importing 📩
```js
const cargv = require('cargv');
```
### Basic CLI ⚾
```js
const options = cargv.read()
	.add({
		name: 'cool',
		type: 'bool', // or boolean (any number above 0 is true, along with 'on' and 'true')
		aliases: ['cargv_is_cool'],
		default: [false],
		description: 'Is CArgV cool?'
	}).done();
console.log(options);

// Result:
{
	cool: {
		name: 'cool',
		value: [ false ],
		arguments: 0
	}
}
```

## Multiple Arguments 2️⃣
You may have noticed that `value` is an array. That's because you can have multiple arguments.
To add multiple arguments, simply add an `arguments` property to the option. The `arguments` property takes an integer which starts from 0. If you'd like different arguments to have different types, just make
the type property an array.

Example:
```js
const options = cargv.read()
	.add({
		name: 'cool',
		type: ['bool', 'num'], // or boolean (any number above 0 is true, along with 'on' and 'true')
		aliases: ['cargv_is_cool'],
		default: [false, 5],
		description: 'Is CArgV cool?',
		arguments: 2
	}).done();
```

## Other Types ✍
### `'boolean'` or `'bool'`
Can be 'true', 'on', any number above 0 for true. anything else is considered false.

### `'none'`
Takes no arguments. If the tag is present, the value will be true.
Recommended use with `default` set to `[false]`

### `'list'` or `'array'` or `'arr'`
Takes a comma seperated (which can be changed by defining a `seperator` property on the option) list.

### `'string'` or `'str'`
Takes anything as a string.

### `'number'` or `'num'`
Takes anything as a float.

### `'any'`
A mix of `'string'` and `'number'`