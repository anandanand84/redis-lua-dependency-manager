 
local function log(logdata)
    redis.call('PUBLISH', 'debug', cjson.encode(logdata));
end


