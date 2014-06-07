# encoding: utf-8
# Truncate
["articles","contents","diaries","image_mappings","images","news_articles","page_layouts","pages","panels","periodicals","sessions","settings","users"].each do |table_name|
  ActiveRecord::Base.connection.execute "TRUNCATE TABLE #{table_name};"
end


# Admin User
User.create({username: "admin", password: User.encrypt("password"), level: "DEVELOPER"})


# Contents
Content.create({content_type: "HEADER", html_content: '<div class="inner-header"></div>'})
Content.create({content_type: "FOOTER", html_content: "<div></div>"})


# Layouts
def create_layout content_type, name, html_content=String.new, num_panels=0
  PageLayout.create({content_type: content_type, name: name, num_panels: num_panels, html_content: html_content})
end

create_layout "PAGE", "5 - Half Top", '<div class="panel-wrapper top full-width">@panel_1</div><div class="panel-wrapper corner middle left">@panel_2</div><div class="panel-wrapper corner middle right">@panel_3</div><div class="panel-wrapper corner bottom left">@panel_4</div><div class="panel-wrapper corner bottom right">@panel_5</div><div class="clear"></div>', 5
create_layout "PAGE", "5 - Half Middle", '<div class="panel-wrapper corner top left">@panel_1</div><div class="panel-wrapper corner top right">@panel_2</div><div class="clear"></div><div class="panel-wrapper middle full-width">@panel_3</div><div class="panel-wrapper corner bottom left">@panel_4</div><div class="panel-wrapper corner bottom right">@panel_5</div>', 5
create_layout "PAGE", "5 - Half Bottom", '<div class="panel-wrapper corner top left">@panel_1</div><div class="panel-wrapper corner top right">@panel_2</div><div class="panel-wrapper corner middle left">@panel_3</div><div class="panel-wrapper corner middle right">@panel_4</div><div class="clear"></div><div class="panel-wrapper middle full-width">@panel_5</div>', 5
home_page_layout = create_layout "PAGE", "4 - Corners Cross", '<div class="panel-wrapper corner home top left">@panel_1</div><div class="panel-wrapper corner home top right">@panel_2</div><div class="cross"><div class="cross-top"></div><div class="cross-left"></div><div class="cross-middle"></div><div class="cross-right"></div><div class="cross-bottom"></div></div><div class="panel-wrapper corner home middle left">@panel_3</div><div class="panel-wrapper corner home middle right">@panel_4</div><div class="clear"></div>', 4
create_layout "PAGE", "4 - Corners", '<div class="panel-wrapper corner top left">@panel_1</div><div class="panel-wrapper corner top right">@panel_2</div><div class="panel-wrapper corner middle left">@panel_3</div><div class="panel-wrapper corner middle right">@panel_4</div><div class="clear"></div>', 4
create_layout "PAGE", "4 - Corners Top", '<div class="panel-wrapper corner top left">@panel_1</div><div class="panel-wrapper corner top right">@panel_2</div><div class="clear"></div><div class="panel-wrapper middle full-width">@panel_3</div><div class="panel-wrapper bottom full-width">@panel_4</div>', 4
create_layout "PAGE", "4 - Corners Middle", '<div class="panel-wrapper top full-width">@panel_1</div><div class="panel-wrapper corner middle left">@panel_2</div><div class="panel-wrapper corner middle right">@panel_3</div><div class="clear"></div><div class="panel-wrapper bottom full-width">@panel_4</div>', 4
create_layout "PAGE", "4 - Corners Bottom", '<div class="panel-wrapper top full-width">@panel_1</div><div class="panel-wrapper middle full-width">@panel_2</div><div class="panel-wrapper corner bottom left">@panel_3</div><div class="panel-wrapper corner bottom right">@panel_4</div>', 4
create_layout "PAGE", "3 - Half", '<div class="panel-wrapper top full-width">@panel_1</div><div class="panel-wrapper middle full-width">@panel_2</div><div class="panel-wrapper bottom full-width">@panel_3</div>', 3
create_layout "PAGE", "3 - Corners Top", '<div class="panel-wrapper corner top left">@panel_1</div><div class="panel-wrapper corner top right">@panel_2</div><div class="clear"></div><div class="panel-wrapper middle full-width">@panel_3</div>', 3
create_layout "PAGE", "3 - Corners Bottom", '<div class="panel-wrapper top full-width">@panel_1</div><div class="panel-wrapper corner middle left">@panel_2</div><div class="panel-wrapper corner middle right">@panel_3</div>', 3
create_layout "PAGE", "2 - Horizontal", '<div class="panel-wrapper top full-width">@panel_1</div><div class="panel-wrapper middle full-width">@panel_2</div>', 2
create_layout "PAGE", "2 - Vertical", '<div class="panel-wrapper top left full-height">@panel_1</div><div class="panel-wrapper top right full-height">@panel_2</div>', 2
create_layout "PAGE", "1 - Full", '<div class="panel-wrapper full">@panel_1</div>', 1
create_layout "PAGE", "0 - Pre-Rendered"

home_panel_layout = create_layout "PANEL", "Corner Text", '<div id="@id" class="panel corner-text @classes">@text</div>'
create_layout "PANEL", "Corner Image", '<div id="@id" class="panel corner-image @classes"><div class="image_container">@images</div></div>'
create_layout "PANEL", "Half Text", '<div id="@id" class="panel half-text @classes">@text</div>'
create_layout "PANEL", "Half Text Split", '<div id="@id" class="panel half-text split @classes"><div class="split-left">@splittext1</div><div class="split-right">@splittext2</div></div>'
create_layout "PANEL", "Half Image", '<div id="@id" class="panel half-image @classes"><div class="image_container">@images</div></div>'
create_layout "PANEL", "Half Image Split", '<div id="@id" class="panel half-image split @classes"><div class="split-left"><div class="image_container">@splitimages1</div></div><div class="split-right"><div class="image_container">@splitimages2</div></div></div>'
create_layout "PANEL", "Half Combo (Image Left)", '<div id="@id" class="panel half-combo-left split @classes"><div class="split-left"><div class="image_container">@images</div></div><div class="split-right">@text</div></div>'
create_layout "PANEL", "Half Combo (Image Right)", '<div id="@id" class="panel half-combo-right split @classes"><div class="split-left">@text</div><div class="split-right"><div class="image_container">@images</div></div></div>'
create_layout "PANEL", "Full", '<div id="@id" class="panel full @classes">@text</div>'


# Home Page
def create_panel page_layout_id, name, text, classes
  Panel.create({page_layout_id: page_layout_id, name: name, text: text, classes: classes})
end

def create_page page_layout_id, title, link, publish, menu_link, menu_position, panel_1, panel_2=nil, panel_3=nil, panel_4=nil, panel_5=nil
  Page.create({page_layout_id: page_layout_id, title: title, link: link, publish: publish, menu_link: menu_link, menu_position: menu_position, panel_1: panel_1, panel_2: panel_2, panel_3: panel_3, panel_4: panel_4, panel_5: panel_5})
end

panel_1 = create_panel home_panel_layout.id, "Home Top Left", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper orci sem, ut commodo diam imperdiet in. Duis et aliquam odio, non tincidunt eros. Sed tortor lacus, gravida ut vehicula et, pretium eu sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque cursus eros enim, eget lacinia nisi cursus sed. Sed vitae sagittis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi euismod, sapien id posuere placerat, risus nunc convallis turpis, nec pulvinar massa lectus ut nisl.", "home-top-left home-text-padding"
panel_2 = create_panel home_panel_layout.id, "Home Top Right", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper orci sem, ut commodo diam imperdiet in. Duis et aliquam odio, non tincidunt eros. Sed tortor lacus, gravida ut vehicula et, pretium eu sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque cursus eros enim, eget lacinia nisi cursus sed. Sed vitae sagittis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi euismod, sapien id posuere placerat, risus nunc convallis turpis, nec pulvinar massa lectus ut nisl.", "home-top-right home-text-padding"
panel_3 = create_panel home_panel_layout.id, "Home Bottom Left", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper orci sem, ut commodo diam imperdiet in. Duis et aliquam odio, non tincidunt eros. Sed tortor lacus, gravida ut vehicula et, pretium eu sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque cursus eros enim, eget lacinia nisi cursus sed. Sed vitae sagittis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi euismod, sapien id posuere placerat, risus nunc convallis turpis, nec pulvinar massa lectus ut nisl.", "home-bottom-left home-text-padding"
panel_4 = create_panel home_panel_layout.id, "Home Bottom Right", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper orci sem, ut commodo diam imperdiet in. Duis et aliquam odio, non tincidunt eros. Sed tortor lacus, gravida ut vehicula et, pretium eu sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque cursus eros enim, eget lacinia nisi cursus sed. Sed vitae sagittis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi euismod, sapien id posuere placerat, risus nunc convallis turpis, nec pulvinar massa lectus ut nisl.", "home-bottom-right home-text-padding"

create_page home_page_layout.id, "Home", "/", true, true, 1, panel_1.id, panel_2.id, panel_3.id, panel_4.id