/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%x startmeta
%%

'--@'                 %{
                        this.begin("startmeta");
                      %}

<startmeta>'require'  return 'REQUIRE'
<startmeta>';'        %{
                         this.begin("INITIAL");
                      %}
<startmeta>\n         %{
                        this.begin('INITIAL');
                      %}
<startmeta>\s+       /* skip whitespace */
<startmeta>\'.*\'         return 'PATH'
<startmeta>.         /* skip if doesnt contain a require and path, it is a comment'
\s+                  /* skip whitespace */
<<EOF>>              return 'EOF'
.                    /* skip other characters */

/lex

%{
  var path = [];
%}

%% /* language grammar */

finalize
    : multiple EOF
      %{
        var result = path;
        path = [];
        return result
      %}
    | EOF
      %{
        var result = path;
        path = [];
        return result
      %}
    ;

multiple
    : meta
    | meta multiple
    ;

meta
     : REQUIRE PATH
       { path.push($2.split("'")[1]); }
     ;


