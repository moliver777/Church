class UsersController < ApplicationController
  before_action :authenticated_user
  before_action :dev_permission
  layout "admin"
  
  # GET /users
  # GET /users.json
  def index
    @users = User.order("username ASC")

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @users }
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show
    @user = User.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/new
  # GET /users/new.json
  def new
    @user = User.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  # POST /users
  # POST /users.json
  def create
    if params[:user][:new_password] === params[:user][:confirm_password]
      params[:user][:password] = User.encrypt(params[:user][:new_password])
      @user = User.new(params[:user].except(:new_password,:confirm_password))
      @valid = true
    else
      @user = self.new
      @user.errors.add(:new_password, "and confirmation must match")
      @valid = false
    end

    respond_to do |format|
      if @valid
        if @user.save
          format.html { redirect_to @user, notice: 'User was successfully created.' }
          format.json { render json: @user, status: :created, location: @user }
        else
          format.html { render action: "new" }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      else
        format.html { render action: "new" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /users/1
  # PUT /users/1.json
  def update
    @user = User.find(params[:id])
    if params[:user][:old_password] === User.decrypt(@user.password)
      if params[:user][:new_password] === params[:user][:confirm_password]
        params[:user][:password] = User.encrypt(params[:user][:new_password])
        params[:user].except!(:old_username,:old_password,:new_password,:confirm_password)
        @valid = true
      else
        @user.errors.add(:new_password, "and confirmation must match")
        @user.errors.add(:confirm_password)
        @valid = false
      end
    else
      @user.errors.add(:old_password, "is not correct")
      @valid = false
    end

    respond_to do |format|
      if @valid
        if @user.update_attributes(params[:user])
          format.html { redirect_to @user, notice: 'User was successfully updated.' }
          format.json { head :ok }
        else
          format.html { render action: "edit" }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      else
        format.html { render action: "edit" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user = User.find(params[:id])
    @user.destroy
    render nothing: true
  end
end
