module Api
  class BearsController < ApplicationController
    def index
      limit = params[:limit].presence&.to_i
      bears = Wikipedia::BearsService.new.list(limit: limit)

      render json: { data: bears }
    rescue Wikipedia::Error => e
      render json: { error: "wikipedia_request_failed", message: e.message }, status: :bad_gateway
    end
  end
end