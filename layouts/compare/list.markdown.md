{{- $p := .Params -}}
{{- $section := . -}}
{{- $pages := where .RegularPages "Params.hidden" "ne" true -}}
# {{ .Title }}

{{ $p.lede | default .Description }}

Last verified {{ $p.verified }}. Status values: Yes = native and documented, Partial = exists with limits, No = absent.
{{ with $p.benefits }}
## How Plakar compares
{{ range . }}
- **{{ .title }}**: {{ .text }}
{{- end }}
{{ end }}
{{ range $p.matrices }}
## {{ .title }}

{{ .intro }}

| Capability | Plakar ({{ .plakar }}) |{{ range .columns }} {{ .name }} |{{ end }}
|---|---|{{ range .columns }}---|{{ end }}
{{ range .rows -}}
| {{ .capability }} |{{ range .cells }} {{ title . }} |{{ end }}
{{ end }}
Full comparisons:{{ range .columns }}{{ with $section.GetPage (printf "/compare/%s" .slug) }} [{{ .Title }}]({{ .Permalink }}index.md){{ end }}{{ end }}
{{ end }}
{{ with $p.matrix_note }}{{ . }}{{ end }}
{{ with $p.questions }}
## {{ $p.questions_title }}

{{ $p.questions_intro }}
{{ range . }}
### {{ .q }}

{{ .why }} Plakar: {{ .answer }}
{{ end }}
{{ end }}
## All comparisons
{{ range $pages }}
- [{{ .Title }}]({{ .Permalink }}index.md): {{ .Params.summary | default .Description }}
{{- end }}
{{ with $p.proof }}
## Proof
{{ range . }}
- **{{ .title }}**: {{ .text }}
{{- end }}
{{ end }}
{{ with $p.faq }}
## Frequently asked questions
{{ range . }}
### {{ .q }}

{{ .a }}
{{ end }}
{{ end }}
