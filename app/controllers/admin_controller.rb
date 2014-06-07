class AdminController < ApplicationController
  def admin
  end
  
  def notes
    @notes = params.include?(:page) ? Note.order("is_read ASC, created_at DESC").page(params[:page]).per(20) : Note.order("is_read ASC, created_at DESC").page("").per(20)
  end
  
  def note
    @note = Note.find(params[:id])
    @note.update_attribute(:is_read, true)
    @unread = Note.where(is_read: false).count
  end
  
  def prayers
    @month = params.include?(:month) ? params[:month] : Date.today.month
    @days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    @prayers = Hash[*Periodical.all.map{|prayer| [prayer.date.strftime("%m%d"), prayer]}.flatten(1)]
  end
  
  def prayer
    @date = "2000-#{params[:date][0..1]}-#{params[:date][2..-1]}"
    @prayer = Periodical.where(date: @date).first
    @prayer = Periodical.new unless @prayer
  end
  
  def update_prayer
    puts params
    prayer = Periodical.where(date: params[:date]).first
    prayer = Periodical.new unless prayer
    puts params[:date]
    prayer.date = params[:date]
    prayer.text = params[:text]
    prayer.save
    render nothing: true
  end
  
  def destroy_prayer
    prayer = Periodical.where(date: params[:date]).first
    prayer.destroy if prayer
    render nothing: true
  end
end
