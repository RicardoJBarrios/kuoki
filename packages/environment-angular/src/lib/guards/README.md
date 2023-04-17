# Angular Environment Guards

> Angular guards related with the environment module.

These guards allow you to manage the load of a route based on the existence or not of certain properties.

## CanActivateEnvironment

Prevent path to be activated if required environment properties doesn't exist.

## Use cases

Below are examples of use cases.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#extending-canactivateenvironment">Extending CanActivateEnvironment</a></li>
    <li><a href="#using-route-data">Using Route Data</a></li>
  </ol>
</details>

### Extending CanActivateEnvironment

All properties can be overriden using Route Data under the `canActivateEnvironment` property.

```ts
@Injectable()
export class UsernameCanActivateEnvironment extends CanActivateEnvironment {
  protected override readonly properties: AtLeastOne<Path> = ['user.username'];
  protected override readonly dueTime = 5000;

  constructor(protected override readonly router: Router, protected override readonly query: EnvironmentQuery) {
    super(router, query);
  }
}

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'path',
        component: HomeComponent,
        canActivate: [UsernameCanActivateEnvironment]
      }
    ]),
    EnvironmentModule.forRoot();
  ],
  providers: [UsernameCanActivateEnvironment]
})
class AppModule {}
```

### Using Route Data

```ts
@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'path',
        component: HomeComponent,
        data: { canActivateEnvironment: { properties: ['user.username'], dueTime: 5000 } }
        canActivate: [CanActivateEnvironment]
      }
    ]),
    EnvironmentModule.forRoot();
  ],
  providers: [CanActivateEnvironment]
})
class AppModule {}
```
