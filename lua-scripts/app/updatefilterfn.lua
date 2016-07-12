local function updatefilterfn(filterName, scripKey, score, limit)
    redis.call('ZADD', filterName, score, scripKey);
    redis.call('ZREMRANGEBYRANK', filterName, limit-1, limit);
    return true;
end;