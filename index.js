var through     = require('through2');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var path        = require('path');
const fs        = require('fs');

var gulp        = require('gulp');
var Parser      = require("jison").Parser;
var jisonFile   = fs.readFileSync(path.resolve(__dirname,'exportsparser.jison'));
var parser      = new Parser(jisonFile.toString());
var DepGraph    = require('dependency-graph').DepGraph;

var PLUGIN_NAME = 'redis-lua-dependency-manager';

module.exports =  function (opts) {
  opts = opts || {};
  var startComment = "--[[ Injected by lua-redis-dependency-manager \n";
  var endComment  = "]]\n";

  var graph = new DepGraph();
  var getDependencyList = function(file){
    var luaFileBuffer = fs.readFileSync(file);
    var luaFileString = (luaFileBuffer.toString());
    var result = parser.parse(luaFileString);
    return result;
  };
  var addDependencyToGraph = function(filePath){
    graph.addNode(filePath);
    var dependencyList = getDependencyList(filePath);
    dependencyList.forEach((dependencyPath) => {
      if(!path.isAbsolute(dependencyPath)){
        dependencyPath = path.normalize(path.dirname(filePath) +'/'+ dependencyPath)
      }
      graph.addNode(dependencyPath);
      graph.addDependency(filePath, dependencyPath);
      addDependencyToGraph(dependencyPath);
    });
  }
  var processFile = function(fileBlob){
    console.log('processing file', fileBlob.path);
    graph = new DepGraph()
    addDependencyToGraph(fileBlob.path);
    var overallOrder = graph.overallOrder();
    console.log('order', overallOrder);
    var contents = "";
    overallOrder.forEach((filePath) => {
      var dependents = graph.dependantsOf(filePath);
      if(!opts.noComments){
        contents = contents + startComment + "-- "+filePath+"\n" + "" + "\n"
        dependents.forEach((dependent) => {
          contents = contents + "-- dependent "+dependent + " \n"
        })
        contents = contents + endComment;
      }else {
        contents = contents + " \n";
      }
      contents = contents + fs.readFileSync(filePath) + "\n" + "" + "\n";
    });
    fileBlob.contents = new Buffer(contents);
    return fileBlob;
  };

  return through.obj(function(file, encoding, callback) {
    if ( file.isNull() ) {
      return callback();
    }
    else if ( file.isStream() ) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported.'));
      return callback();
    }
    try {
      callback(null, processFile(file));
    } catch (e) {
      console.error(e);
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Error:', e));
      callback(e);
    }
  });
};















gulp.task('default', function() {
  gulp.src(['./lua-scripts/app/*.lua'])
      .pipe(tap(function(file){
        processFile(file);
      }));
  gulp.watch(['./lua-scripts/app/*.lua'],function(file){
    processFile(file);
  });
});


