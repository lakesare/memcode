# How to develop meresei.com

```bash
make start
cd meresei/frontend; npm run development
```

# How to deploy meresei.com

1. Work in the `heroku` branch

```bash
git checkout heroku
```

2. Push to **heroku**'s `master` branch from the **local** `heroku` branch!

```bash
npm run production
git push heroku heroku:master
```

# How to deploy memcode.com

1. Work in the `master` branch

```bash
git checkout master
```

2. Push to **heroku**'s `master` branch from the **local** `heroku` branch!

```bash
git checkout heroku
git merge master
```