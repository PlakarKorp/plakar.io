{{- /*
  Markdown version of an integration page, served to answer engines and LLMs.
  Layout shortcodes (cards, card, pairs, pair, steps, step) are stripped and
  their Markdown content kept. A pair's lead becomes bold text.
*/ -}}
{{- $md := .RawContent -}}
{{- $md = replaceRE `\{\{<\s*pair\s+lead="([^"]*)"\s*>\}\}\s*` "- **$1** " $md -}}
{{- $md = replaceRE `\{\{<\s*/?\s*(cards|card|pairs|pair|steps|step)\b[^>]*>\}\}\n?` "" $md -}}
{{- $md = replaceRE `\n{3,}` "\n\n" $md -}}
# {{ .Params.subtitle }}

{{ .Description | strings.TrimSpace }}

{{ $md }}
