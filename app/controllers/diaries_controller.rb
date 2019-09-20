class DiariesController < ApplicationController
  before_action :authenticated_user
  before_action :dev_permission
  layout "admin"
  
  # GET /diaries
  # GET /diaries.json
  def index
    @diaries = Diary.order("date DESC")

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @diaries }
    end
  end

  # GET /diaries/1
  # GET /diaries/1.json
  def show
    @diary = Diary.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @diary }
    end
  end

  # GET /diaries/new
  # GET /diaries/new.json
  def new
    @diary = Diary.new
    @images = Image.all.map{|i| [i.name,i.id]}

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @diary }
    end
  end

  # GET /diaries/1/edit
  def edit
    @diary = Diary.find(params[:id])
    @images = Image.all.map{|i| [i.name,i.id]}
  end

  # POST /diaries
  # POST /diaries.json
  def create
    images = JSON.parse(params[:diary][:images]) rescue []
    @diary = Diary.new(params[:diary].except!(:images))

    respond_to do |format|
      if @diary.save
        images.each do |image|
          unless image == "0"
            ImageMapping.create({
              diary_id: @diary.id,
              image_id: image
            })
          end
        end
        format.html { redirect_to @diary, notice: 'Diary was successfully created.' }
        format.json { render json: @diary, status: :created, location: @diary }
      else
        format.html { render action: "new" }
        format.json { render json: @diary.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /diaries/1
  # PUT /diaries/1.json
  def update
    images = JSON.parse(params[:diary][:images]) rescue []
    @diary = Diary.find(params[:id])

    respond_to do |format|
      if @diary.update_attributes(params[:diary].except!(:images))
        @diary.image_mappings.destroy_all
        images.each do |image|
          unless image == "0"
            ImageMapping.create({
              diary_id: @diary.id,
              image_id: image
            })
          end
        end
        format.html { redirect_to @diary, notice: 'Diary was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @diary.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /diaries/1
  # DELETE /diaries/1.json
  def destroy
    @diary = Diary.find(params[:id])
    @diary.image_mappings.destroy_all
    @diary.destroy
    render nothing: true
  end
end
