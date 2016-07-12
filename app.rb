require 'serialport'
require 'json'
require 'sinatra'
require 'twitter'
require 'dotenv'

Thread.start do
  Dotenv.load
  client = Twitter::REST::Client.new do |config|
    config.consumer_key        = ENV['CONSUMERKEY']
    config.consumer_secret     = ENV['CONSUMERSECRET']
    config.access_token        = ENV['ACCESSTOKEN']
    config.access_token_secret = ENV['ACCESSTOKENSECRET']
  end

  sp = SerialPort.open('/dev/tty.usbserial-MW7LS89', 115200, 8, 1, 0)
  a_data = ''

  loop do
    data = sp.readline.chomp.strip
    case data[-15]
    when '0'
      puts "close"
    when '1'
      puts "open"
      if a_data == '0'
        time = Time.now.strftime("%Y-%m-%d %H:%M:%S")
        # client.update("@youraccount 窓が開きました。#{time}")
        json_data = JSON.parse(open('openlog.json').read)
        json_data << time
        open('openlog.json', 'w') do |io|
          JSON.dump(json_data, io)
        end
      end
    end
    a_data = data[-15]
  end
end

get '/' do
  erb :index
end

get '/api/openlogs' do
  content_type :json
  data = JSON.parse(open('openlog.json').read)
  data.to_json
end

