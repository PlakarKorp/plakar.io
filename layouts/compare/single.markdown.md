{{- $p := .Params -}}
{{- $competitor := $p.competitor_short | default $p.competitor -}}
{{- $plakar := $p.plakar_product | default "Plakar" -}}
# {{ .Title }}

{{ $p.verdict }}

Compared: {{ $plakar }}{{ with $p.plakar_version }} ({{ . }}){{ end }} vs {{ $p.competitor }}{{ with $p.competitor_version }} ({{ . }}){{ end }}. Last verified {{ $p.verified }}. Status values: Yes = native and documented, Partial = exists with limits or add-ons, No = absent.
{{ with $p.highlights }}
## Key differences
{{ range . }}
- **{{ .title }}**: {{ .text }}
{{- end }}
{{ end }}
## {{ $plakar }} vs {{ $competitor }} at a glance

| Capability | Plakar ({{ $plakar }}) | {{ $competitor }} |
|---|---|---|
{{ range $p.table -}}
| **{{ .section }}** | | |
{{ range .rows -}}
| {{ .capability }} | {{ title .plakar.status }}{{ with .plakar.note }}: {{ . }}{{ end }} | {{ title .competitor.status }}{{ with .competitor.note }}: {{ . }}{{ end }} |
{{ end -}}
{{ end }}
{{ with $p.sections }}
## Where the difference shows up
{{ range . }}
### {{ .heading }}

{{ with .competitor_text }}{{ $competitor }}: {{ . }}{{ end }}

{{ with .plakar_text }}Plakar: {{ . }}{{ end }}
{{ range .bullets }}
- {{ . }}
{{- end }}
{{ end }}
{{ end }}
## Choose {{ $competitor }} when
{{ range $p.choose_competitor }}
- {{ . }}
{{- end }}

## Choose {{ $plakar }} when
{{ range $p.choose_plakar }}
- {{ . }}
{{- end }}
{{ with .RawContent }}
{{ . }}
{{ end }}
{{ with $p.faq }}
## Frequently asked questions
{{ range . }}
### {{ .q }}

{{ .a }}
{{ end }}
{{ end }}
{{ with $p.sources }}
## Sources
{{ range . }}
- [{{ .label }}]({{ .url }})
{{- end }}
{{ end }}
