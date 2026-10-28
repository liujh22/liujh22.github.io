# frozen_string_literal: true

EXPECTED_SOURCE = "https://cassyni.com/embed/events/33NjVU33GSXff6VZrbSDJD"
EXPECTED_TITLE =
  "Lighting and circadian cues shape locomotor strategies for balance and navigation in larval zebrafish - presented by Jiahuan Liu (Cassyni)"
EXPECTED_ALLOW = "fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"

pages = {
  "homepage" => File.join(__dir__, "..", "_site", "index.html"),
  "publications page" => File.join(__dir__, "..", "_site", "publications", "index.html"),
}

failures = pages.each_with_object([]) do |(label, path), errors|
  unless File.exist?(path)
    errors << "#{label}: rendered page is missing at #{path}"
    next
  end

  html = File.read(path)
  errors << "#{label}: Video control is missing" unless html.match?(/<a\b[^>]*\brole="button"[^>]*>Video<\/a>/m)
  iframe = html.scan(/<iframe\b[^>]*>/m).find { |tag| tag.include?(EXPECTED_SOURCE) }
  unless iframe
    errors << "#{label}: Cassyni iframe is missing"
    next
  end
  errors << "#{label}: Cassyni iframe title is missing" unless iframe.include?(%(title="#{EXPECTED_TITLE}"))
  errors << "#{label}: Cassyni iframe is not full width" unless iframe.match?(/width:\s*100%/)
  errors << "#{label}: Cassyni iframe is not 16:9" unless iframe.match?(%r{aspect-ratio:\s*16\s*/\s*9})
  errors << "#{label}: Cassyni iframe cannot enter fullscreen" unless iframe.include?("allowfullscreen")
  errors << "#{label}: Cassyni iframe media permissions are incomplete" unless iframe.include?(%(allow="#{EXPECTED_ALLOW}"))
  errors << "#{label}: Cassyni iframe scrolling mode is missing" unless iframe.include?(%(scrolling="auto"))

  nil
end

abort failures.join("\n") unless failures.empty?

puts "Cassyni video is embedded responsively on the homepage and publications page."
