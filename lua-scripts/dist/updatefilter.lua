 
local function updatefilterfn(filterName, scripKey, score, limit)
    redis.call('ZADD', filterName, score, scripKey);
    redis.call('ZREMRANGEBYRANK', filterName, limit-1, limit);
    return true;
end;

 
--@require './updatefilterfn.lua'

local filterName     = KEYS[1];
local scripKey       = ARGV[1];
local score          = ARGV[2];
local limit          = ARGV[3];
updatefilterfn(filterName, scripKey, score, limit);

