{{ $content := .RawContent | replaceRE `\{\{[<%]-?\s*children[^}]*-?[>%]\}\}\n?` "" }}
{{ $content }}
{{ $pages := where (where .Pages "Params.hidden" "ne" true) "Title" "ne" "" }}
{{ if $pages }}

{{ range $pages }}
## [{{ .LinkTitle }}]({{ .Permalink }}index.md)
{{ $subpages := where (where .Pages "Params.hidden" "ne" true) "Title" "ne" "" }}
{{ range $subpages }}- [{{ .LinkTitle }}]({{ .Permalink }}index.md){{ with or .Description .Summary }}: {{ . }}{{ end }}
{{ end }}
{{ end }}
{{ end }}
