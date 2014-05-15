# Admin User
User.create({:username => "admin", :password => User.encrypt("password"), :level => "DEVELOPER"})

# Contents
Content.create({:content_type => "HEADER", :html_content => "<div>HEADER CONTENT</div>"})
Content.create({:content_type => "FOOTER", :html_content => "<div>FOOTER CONTENT</div>"})