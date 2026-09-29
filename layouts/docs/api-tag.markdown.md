{{- $spec := index site.Data.openapi .Params.apiVersion -}}
{{- $tag := .Params.apiTag -}}
# {{ .Title }}

{{ with .Params.summary }}{{ . }}{{ end }}

Generated from Plakar Control Plane {{ replaceRE `\.[0-9a-f]{40}$` "" $spec.info.version }}. See [OpenAPI {{ .Params.apiVersion }}]({{ .Parent.Permalink }}index.md) for the base URL, authentication and error format.
{{ range $path, $item := $spec.paths }}
{{- range $m := slice "get" "post" "put" "patch" "delete" }}
{{- with index $item $m }}
{{- if in .tags $tag }}

## {{ .summary }}

`{{ upper $m }} {{ $path }}`
{{ with .description }}
{{ . }}
{{ end }}
{{- $schemes := slice }}
{{- range .security }}{{ range $name, $_ := . }}{{ $schemes = $schemes | append $name }}{{ end }}{{ end }}
Authentication: {{ with $schemes }}{{ delimit . ", " }}{{ else }}none{{ end }}
{{- with .parameters }}

Parameters:
{{ range . }}
- `{{ .name }}` ({{ .in }}, {{ partial "api/type.html" (dict "schema" (.schema | default dict) "spec" $spec) }}{{ if .required }}, required{{ end }}){{ with .description }}: {{ . }}{{ end }}
{{- end }}
{{- end }}
{{- with .requestBody }}
{{- range $type, $media := .content }}

Request body ({{ $type }}): {{ with index ($media.schema | default dict) "$ref" }}`{{ path.Base . }}`{{ else }}{{ partial "api/type.html" (dict "schema" ($media.schema | default dict) "spec" $spec) }}{{ end }}
{{- end }}
{{- end }}

Responses:
{{ range $code, $resp := .responses }}
- `{{ $code }}`{{ with $resp.description }} {{ . }}{{ end }}{{ range $type, $media := $resp.content }}{{ with index ($media.schema | default dict) "$ref" }}: `{{ path.Base . }}`{{ end }}{{ end }}
{{- end }}
{{- end }}
{{- end }}
{{- end }}
{{- end }}
