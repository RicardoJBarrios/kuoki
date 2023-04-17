# Angular Environment Pipes

> Pipes to render an environment value in template.

To use these pipes it is not necessary to inject the [`EnvironmentQuery`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentQuery.html) service into the component. They use their own injector to get the properties.

## Use cases

Below are examples of the expected behavior and some implementation examples.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#environmentValue">environmentValue</a></li>
    <li><a href="#environmentValue-1">environmentValue$</a></li> 
  </ol>
</details>

### environmentValue

Gets the value at path from environment or the path if value is undefined.

This pipe uses [`EnvironmentQuery.get(Path,GetOptions?)`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentQuery.html#get) to get the value synchronously and render it in the template. If the value doesn't exist or throws an error, the path will be rendered as a string.

```ts
// Environment = {a:0, b:'v{{a}}'};
// opt1 = {defaultValue:'D'}
// opt2 = {targetType:(v:number)=>(v+1)}
// opt3 = {transpile:{a:0}}
// opt4 = {transpile:{},config:{transpileEnvironment:true}}
// opt5 = {required:true}

`{{ 'a' | environmentValue }}`; // render 0
`{{ 'z' | environmentValue }}`; // render 'z'
`{{ 'z' | environmentValue:opt1 }}`; // render 'D'
`{{ 'a' | environmentValue:opt2 }}`; // render '1'
`{{ 'b' | environmentValue:opt3 }}`; // render 'v0'
`{{ 'b' | environmentValue:opt4 }}`; // render 'v0'
`{{ 'a' | environmentValue:opt5 }}`; // render 0
`{{ 'z' | environmentValue:opt5 }}`; // render 'z' throws EnvironmentReferenceError
```

### environmentValue$

Gets the value at path as Observable from environment or the path as Observable if value is undefined.

This pipe uses [`EnvironmentQuery.get$(Path,GetOptionsReactive?)`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentQuery.html#get) to get the value asynchronously and render it in the template. If the value doesn't exist the path will be rendered as a string.

```ts
// Environment = {a:0, b:'v{{a}}'};
// opt1 = {defaultValue:'D'}
// opt2 = {targetType:(v:number)=>(v+1)}
// opt3 = {transpile:{a:0}}
// opt4 = {transpile:{},config:{transpileEnvironment:true}}

`{{ 'a' | environmentValue$ | async }}`; // render 0
`{{ 'z' | environmentValue$ | async }}`; // render 'z'
`{{ 'z' | environmentValue$:opt1 | async }}`; // render 'D'
`{{ 'a' | environmentValue$:opt2 | async }}`; // render '1'
`{{ 'b' | environmentValue$:opt3 | async }}`; // render 'v0'
`{{ 'b' | environmentValue$:opt4 | async }}`; // render 'v0'
```
