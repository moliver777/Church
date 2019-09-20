class PeriodicalsController < ApplicationController
  before_action :authenticated_user
  before_action :dev_permission
  layout "admin"
  
  # GET /periodicals
  # GET /periodicals.json
  def index
    @periodicals = Periodical.order("date DESC")

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @periodicals }
    end
  end

  # GET /periodicals/1
  # GET /periodicals/1.json
  def show
    @periodical = Periodical.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @periodical }
    end
  end

  # GET /periodicals/new
  # GET /periodicals/new.json
  def new
    @periodical = Periodical.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @periodical }
    end
  end

  # GET /periodicals/1/edit
  def edit
    @periodical = Periodical.find(params[:id])
  end

  # POST /periodicals
  # POST /periodicals.json
  def create
    @periodical = Periodical.new(params[:periodical])

    respond_to do |format|
      if @periodical.save
        format.html { redirect_to @periodical, notice: 'Periodical was successfully created.' }
        format.json { render json: @periodical, status: :created, location: @periodical }
      else
        format.html { render action: "new" }
        format.json { render json: @periodical.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /periodicals/1
  # PUT /periodicals/1.json
  def update
    @periodical = Periodical.find(params[:id])

    respond_to do |format|
      if @periodical.update_attributes(params[:periodical])
        format.html { redirect_to @periodical, notice: 'Periodical was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @periodical.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /periodicals/1
  # DELETE /periodicals/1.json
  def destroy
    @periodical = Periodical.find(params[:id])
    @periodical.destroy
    render nothing: true
  end
end
