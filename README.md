# redis-lua-dependency-manager
Gulp plugin that manages and inject dependency for redis lua script, so that the lua script can be written as composable modules


## How to add dependency.

In the file that requires dependency add --@require 'FILE_NAME'; See below for example

```
--@require './log.lua';

local minuteKeys = redis.call('keys','*MYLIST');
for i,key in ipairs(minuteKeys) do
    redis.call("LTRIM",key,0 , 2000)
end

```

The output file will contain

```
--[[ Injected by lua-redis-dependency-manager 
-- /Users/AAravindan/dev/redis-lua-dependency-manager/lua-scripts/app/log.lua

-- dependent /Users/AAravindan/dev/redis-lua-dependency-manager/lua-scripts/app/ClearOldRecords.lua 
]]
local function log(logdata)
    redis.call('PUBLISH', 'debug', cjson.encode(logdata));
end

--[[ Injected by lua-redis-dependency-manager 
-- /Users/AAravindan/dev/redis-lua-dependency-manager/lua-scripts/app/ClearOldRecords.lua

]]
--@require './log.lua';
local minuteKeys = redis.call('keys','*MYLIST');
for i,key in ipairs(minuteKeys) do
    redis.call("LTRIM",key,0 , 2000)
end

```

## API

### redis-lua-dependency-manager(options)

#### options

##### noComments(optional)

Do not add comments about the dependency file.

Type: `boolean`<br>
Default: `false`

## Configure

1. This is a gulp plugin so it requires node, npm and gulp to be installed.

```
npm init;
npm install --save redis-lua-dependency-manager 
```

2. create a gulpfile.js with below contents.

```
var gulp = require('gulp');
var addLuaDependents = require('./index.js');

gulp.task('default', function() {
  gulp.src(['./lua-scripts/app/*.lua'])
      .pipe(addLuaDependents())
      .pipe(gulp.dest('./lua-scripts/dist'))
});

```

3. execute `gulp` and you can see your files available in dist directory.

4. You can also use gulp watch to run whenever the file changes.

## Contributing.

Create issues or provide pull requests if you made any enhancement.


## Sample.

You can clone this repository execute `npm install` and then execute `gulp` to see it in action.