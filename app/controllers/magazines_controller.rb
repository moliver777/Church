class MagazinesController < ApplicationController
  before_filter :authenticated_user
  layout "admin"
  
  # GET /magazines
  # GET /magazines.json
  def index
    @magazines = Magazine.order("date DESC")

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @articles }
    end
  end

  # GET /magazines/1
  # GET /magazines/1.json
  def show
    @magazine = Magazine.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @magazine }
    end
  end

  # GET /magazines/new
  # GET /magazines/new.json
  def new
    @magazine = Magazine.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @magazine }
    end
  end

  # GET /magazines/1/edit
  def edit
    @magazine = Magazine.find(params[:id])
  end

  # POST /magazines
  # POST /magazines.json
  def create
    @magazine = Magazine.new(params[:magazine])
    @magazine.filename = "magazine_#{params[:magazine][:date]}"

    respond_to do |format|
      if @magazine.save
        format.html { redirect_to @magazine, notice: 'Magazine was successfully created.' }
        format.json { render json: @magazine, status: :created, location: @magazine }
      else
        format.html { render action: "new" }
        format.json { render json: @magazine.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /magazines/1
  # PUT /magazines/1.json
  def update
    @magazine = Magazine.find(params[:id])

    respond_to do |format|
      if @magazine.update_attributes(params[:magazine])
        format.html { redirect_to @magazine, notice: 'Magazine was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @magazine.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /magazines/1
  # DELETE /magazines/1.json
  def destroy
    @magazine = Magazine.find(params[:id])
    @magazine.destroy
    render nothing: true
  end
end
