class NewsArticlesController < ApplicationController
  before_action :authenticated_user
  layout "admin"

  # GET /news_article
  # GET /news_article.json
  def index
    @news_article = NewsArticle.order("id ASC")

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @news_article }
    end
  end

  # GET /news_article/1
  # GET /news_article/1.json
  def show
    @news_article = NewsArticle.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @news_article }
    end
  end

  # GET /news_article/new
  # GET /news_article/new.json
  def new
    @news_article = NewsArticle.new
    # @images = Image.all.map{|i| [i.name,i.id]}

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @news_article }
    end
  end

  # GET /news_article/1/edit
  def edit
    @news_article = NewsArticle.find(params[:id])
    # @images = Image.all.map{|i| [i.name,i.id]}
  end

  # POST /news_article
  # POST /news_article.json
  def create
    # images = params[:news_article][:images]
    @news_article = NewsArticle.new(params[:news_article].permit(:title, :published))

    respond_to do |format|
      if @news_article.save
        # images.split(",").each do |image|
        #   unless image == "0"
        #     ImageMapping.create({
        #       news_article_id: @news_article.id,
        #       image_id: image
        #     })
        #   end
        # end
        format.html { redirect_to @news_article, notice: 'News Article was successfully created.' }
        format.json { render json: @news_article, status: :created, location: @news_article }
      else
        format.html { render action: "new" }
        format.json { render json: @news_article.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /news_article/1
  # PUT /news_article/1.json
  def update
    # images = params[:news_article][:images]
    @news_article = NewsArticle.find(params[:id])

    respond_to do |format|
      if @news_article.update_attributes(params[:news_article].permit(:title, :published))
        # @news_article.image_mappings.destroy_all
        # images.split(",").each do |image|
        #   unless image == "0"
        #     ImageMapping.create({
        #       news_article_id: @news_article.id,
        #       image_id: image
        #     })
        #   end
        # end
        format.html { redirect_to @news_article, notice: 'News Article was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @news_article.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /news_article/1
  # DELETE /news_article/1.json
  def destroy
    @news_article = NewsArticle.find(params[:id])
    # @news_article.image_mappings.destroy_all
    @news_article.destroy
    render nothing: true
  end
end
