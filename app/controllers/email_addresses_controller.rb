class EmailAddressesController < ApplicationController
  before_action :authenticated_user
  before_action :dev_permission
  layout "admin"

  def subscribe
    subs = EmailAddress.where(email_address: params[:email_address])
    subs.first ? subs.update_all(enabled: true) : EmailAddress.create({email_address: params.permit(:email_address)})
    render nothing: true
  end

  def unsubscribe
    EmailAddress.where(email_address: params[:email_address]).update_all(enabled: false)
    render nothing: true
  end

  # GET /email_addresses
  # GET /email_addresses.json
  def index
    email_addresses = EmailAddress.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @email_addresses }
    end
  end

  # GET /email_addresses/1
  # GET /email_addresses/1.json
  def show
    @email_address = EmailAddress.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @email_address }
    end
  end

  # GET /email_addresses/new
  # GET /email_addresses/new.json
  def new
    @email_address = EmailAddress.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @email_address }
    end
  end

  # GET /email_addresses/1/edit
  def edit
    @email_address = EmailAddress.find(params[:id])
  end

  # POST /email_addresses
  # POST /email_addresses.json
  def create
    @email_address = EmailAddress.new(params.permit(:email_address))

    respond_to do |format|
      if @email_address.save
        format.html { redirect_to @email_address, notice: 'Email Address was successfully created.' }
        format.json { render json: @email_address, status: :created, location: @email_address }
      else
        format.html { render action: "new" }
        format.json { render json: @email_address.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /email_addresses/1
  # PUT /email_addresses/1.json
  def update
    @email_address = EmailAddress.find(params[:id])

    respond_to do |format|
      if @email_address.update_attributes(params.permit(:email_address))
        format.html { redirect_to @email_address, notice: 'Email Address was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @email_address.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /email_addresses/1
  # DELETE /email_addresses/1.json
  def destroy
    @email_address = EmailAddress.find(params[:id])
    @email_address.destroy
    render nothing: true
  end
end
