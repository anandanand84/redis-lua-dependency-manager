--@require './updatefilterfn.lua'

local filterName     = KEYS[1];
local scripKey       = ARGV[1];
local score          = ARGV[2];
local limit          = ARGV[3];
updatefilterfn(filterName, scripKey, score, limit);