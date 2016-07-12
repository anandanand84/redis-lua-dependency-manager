--local KEYS, ARGV, redis = ...
--local cjson = require 'cjson'
--@require './log.lua';
local minuteKeys = redis.call('keys','*MYLIST');
for i,key in ipairs(minuteKeys) do
    redis.call("LTRIM",key,0 , 2000)
end
